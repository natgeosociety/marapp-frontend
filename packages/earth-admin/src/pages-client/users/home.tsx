/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import List from '@researchgate/react-intersection-list';
import { navigate } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import Creatable from 'react-select/creatable';

import { AuthzGuards, ErrorMessages, Spinner } from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { Card } from '@app/components/card';
import { ContentLayout } from '@app/layouts';
import { getAvailableGroups } from '@app/services';
import { addUsers, getAllUsers } from '@app/services/users';
import { encodeQueryToURL } from '@app/utils';
import { useInfiniteList } from '@app/utils/hooks';
import { validEmail } from '@app/utils/validations';

import { CUSTOM_STYLES, SELECT_THEME } from '../../theme';

const PAGE_SIZE = 10;

export function UsersHome(props: any) {
  const { getPermissions, selectedGroup } = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);

  const [isLoadingInviteUsers, setIsLoadingInviteUsers] = useState(false);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);
  const [usersFeedback, setUsersFeedback] = useState([]);

  const getQuery = (pageIndex) => {
    const query = {
      page: { size: PAGE_SIZE, number: pageIndex },
      group: selectedGroup,
      include: 'groups',
    };
    return encodeQueryToURL('users', query);
  };
  const { listProps: userListProps, mutate } = useInfiniteList(getQuery, getAllUsers);

  const { watch, setValue, control, getValues } = useForm({
    mode: 'onChange',
  });

  const inviteUsersWatcher = watch('users');

  useEffect(() => {
    // refetch the latest data on mount
    if (userListProps.data.length) {
      mutate();
    }

    (async () => {
      const groupsResponse: any = await getAvailableGroups(selectedGroup);
      const groups = groupsResponse.data.map((item) => ({ label: item.name, value: item.id }));
      setAvailableGroups(groups);
      setValue(
        'role',
        groups.find((group) => group.label.includes('VIEWER'))
      );
    })();
  }, []);

  const customStylesUsers = {
    ...CUSTOM_STYLES,
    multiValueLabel: (provided, state) => {
      return {
        ...provided,
        color: state.data.hasError
          ? 'red'
          : state.data.hasSuccess
          ? 'green'
          : 'var(--marapp-gray-9)',
        borderRadius: '50px',
        display: 'flex',
      };
    },
    multiValueRemove: (provided, state) => ({
      ...provided,
      color: state.data.hasError ? 'red' : 'var(--marapp-gray-9)',
    }),
    control: (provided, state) => {
      return {
        ...provided,
        minHeight: '55px',
      };
    },
  };

  const customStylesRoles = {
    ...CUSTOM_STYLES,
    control: (provided, state) => {
      return {
        ...provided,
        minHeight: '55px',
      };
    },
  };

  const addUsersHandler = async () => {
    setServerErrors([]);
    setUsersFeedback([]);
    setIsLoadingInviteUsers(true);

    const { users, role } = getValues();

    try {
      const result: any = await addUsers(
        {
          emails: users.map((user) => user.value),
          groups: [role?.value],
        },
        selectedGroup
      );

      const feedback = [];

      const feedbackUsers = result.data.map((item) => {
        const hasError = !!item.error;
        const hasSuccess = !!item.success;

        feedback.push({
          hasError,
          hasSuccess,
          title: item.email,
          detail: item.error,
        });

        return {
          label: item.email,
          value: item.email,
          hasError,
          hasSuccess,
        };
      });

      setValue('users', feedbackUsers);
      setUsersFeedback(feedback);

      mutate();
    } catch (err) {
      setServerErrors(err.data?.errors || err.data);
    }

    setIsLoadingInviteUsers(false);
  };

  const cancelUsersHandler = () => {
    setValue('users', []);
    setServerErrors([]);
    setUsersFeedback([]);
  };

  return (
    writePermissions && (
      <ContentLayout className="marapp-qa-usershome">
        {writePermissions && (
          <>
            <div className="ng-grid">
              <div className="ng-width-1-1 ng-margin-bottom">
                <Card>
                  <div className="ng-grid">
                    <div className="ng-width-1-1">
                      <p className="ng-text-weight-bold">Add users to {selectedGroup}:</p>
                    </div>
                    <div className="ng-width-10-12">
                      <Controller
                        name="users"
                        type="users"
                        className="marapp-qa-invite-users"
                        defaultValue={[]}
                        control={control}
                        selectedGroup={selectedGroup}
                        as={Creatable}
                        formatCreateLabel={(value) => `${value}`}
                        isValidNewOption={(value) => validEmail(value)}
                        isMulti={true}
                        placeholder="Enter user emails to submit invite"
                        styles={customStylesUsers}
                        theme={(theme) => ({
                          ...theme,
                          ...SELECT_THEME,
                        })}
                        rules={{ required: true }}
                      />
                    </div>
                    <div className="ng-width-2-12 ng-margin-bottom ng-padding-remove">
                      <Controller
                        as={Select}
                        control={control}
                        className="marapp-qa-invite-role"
                        name="role"
                        options={availableGroups}
                        isSearchable={false}
                        placeholder="Select role"
                        styles={customStylesRoles}
                        theme={(theme) => ({
                          ...theme,
                          ...SELECT_THEME,
                        })}
                        rules={{ required: true }}
                      />
                    </div>
                    {serverErrors.length > 0 && <ErrorMessages errors={serverErrors} />}
                    {usersFeedback.length > 0 && (
                      <div className="ng-width-1-1 ng-margin-bottom">
                        {usersFeedback.map((error) =>
                          error.hasSuccess ? (
                            <p className="ng-margin-remove">
                              The email, {error.title} has been invited.
                            </p>
                          ) : (
                            error.hasError && (
                              <p className="ng-margin-remove">
                                The email, {error.title} is unavailable. Please enter a new email to
                                add users to your organization.
                              </p>
                            )
                          )
                        )}
                      </div>
                    )}
                    <div className="ng-width-1-1 ng-margin-top">
                      {isLoadingInviteUsers ? (
                        <>
                          <div className="ng-padding-medium ng-position-relative">
                            <Spinner size="small" />
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={addUsersHandler}
                            className="ng-button ng-button-primary ng-button-large ng-margin-medium-right marapp-qa-actionsubmit"
                            disabled={!inviteUsersWatcher?.length}
                          >
                            Add users
                          </button>
                          <button
                            className="ng-button ng-button-secondary ng-button-large ng-margin-medium-right marapp-qa-actioncancel"
                            onClick={cancelUsersHandler}
                            disabled={!inviteUsersWatcher?.length}
                          >
                            cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              <div className="ng-width-1-1 ng-margin-top">
                <Card>
                  <table className="ng-table">
                    <thead>
                      <tr>
                        <th className="ng-border-remove ng-width-1-2">Organization Members</th>
                        <th className="ng-border-remove ng-width-1-2">Member Roles</th>
                      </tr>
                    </thead>
                    <List
                      awaitMore={userListProps.awaitMore}
                      itemCount={userListProps.data.length}
                      pageSize={PAGE_SIZE}
                      onIntersection={userListProps.onIntersection}
                      itemsRenderer={(items, ref) => (
                        <tbody className="list" ref={ref}>
                          {items}
                          <tr>
                            <td className="ng-border-remove" colSpan={2}>
                              <div className="ng-padding-medium ng-position-relative">
                                {userListProps.isLoading && <Spinner size="small" />}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      )}
                      renderItem={(index) => {
                        const user = userListProps.data[index];
                        return (
                          <tr
                            key={user.email}
                            className="ng-c-cursor-pointer"
                            onClick={() => navigate(`/${selectedGroup}/users/${user.email}`)}
                          >
                            <td className="ng-border-remove">{user.email}</td>
                            <td className="ng-border-remove">
                              {user.groups.map((group) => group.name).join(', ')}
                            </td>
                          </tr>
                        );
                      }}
                    />
                  </table>
                </Card>
              </div>
            </div>
          </>
        )}
      </ContentLayout>
    )
  );
}
