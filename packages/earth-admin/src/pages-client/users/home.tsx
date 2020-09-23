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

import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';

import { useAuth0 } from '@app/auth/auth0';
import { AuthzGuards, InlineEditCard } from '@marapp/earth-shared';

import Creatable from 'react-select/creatable';
import Select from 'react-select';

import { ContentLayout } from '@app/layouts';
import { Card } from '@app/components/card';
import { LinkWithOrg } from 'components/link-with-org';
import { Controller, useForm } from 'react-hook-form';
import { getAllUsers, addUsers } from '@app/services/users';
import { encodeQueryToURL, setPage } from '@app/utils';
import { getAvailableGroups } from '@app/services';
import List from '@researchgate/react-intersection-list';
import { Spinner } from '@marapp/earth-shared';
import { ErrorMessages } from '@marapp/earth-shared';
import { validEmail } from '@app/utils/validations';

import { CUSTOM_STYLES, SELECT_THEME } from '../../theme';

const PAGE_SIZE = 10;
const USER_DETAIL_QUERY = {
  include: 'groups',
};

export function UsersHome(props: any) {
  const { getPermissions, selectedGroup } = useAuth0();
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInviteUsers, setIsLoadingInviteUsers] = useState(false);
  const [availableGroups, setAvailableGroups] = useState([]);
  // const [selectedUsers, setSelectedUsers] = useState([]);
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

  useEffect(() => {
    (async () => {
      const groupsResponse: any = await getAvailableGroups(selectedGroup);
      setAvailableGroups(groupsResponse.data.map((item) => ({ label: item.name, value: item.id })));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const usersResponse: any = await getAllUsers(getQuery(currentPage));
      setUsers([...users, ...usersResponse.data]);
      setIsLoading(false);
    })();
  }, [currentPage]);

  const {
    register,
    watch,
    formState,
    errors,
    setValue,
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    mode: 'onChange',
  });

  const hasNextPage = users.length >= PAGE_SIZE;
  const awaitMore = !isLoading && hasNextPage;

  const [openAddUsers, setOpenAddUsers] = useState(false);

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
  };
  const customStylesRoles = {
    ...CUSTOM_STYLES,
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

      const errors = [];

      const feedbackUsers = result.data.map((item) => {
        const hasError = !!item.error;
        const hasSuccess = !!item.success;

        // if (hasError) {
        errors.push({
          hasError,
          hasSuccess,
          title: item.email,
          detail: item.error,
        });
        // }

        return {
          label: item.email,
          value: item.email,
          hasError,
          hasSuccess,
        };
      });

      setValue('users', feedbackUsers);
      setUsersFeedback(errors);
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
                <InlineEditCard
                  submitButtonText="Add users"
                  // render={() => {
                  // return (
                  //   <>
                  //     <div className="ng-grid">
                  //       <div className="ng-width-1-1">
                  //         <p className="ng-text-weight-bold">Add users to { selectedGroup }:</p>
                  //       </div>
                  //       <div className="ng-width-10-12">
                  //         <Controller name="widgets"
                  //                     type="widgets"
                  //                     className="marapp-qa-widgets"
                  //                     control={control}
                  //                     // getOptionLabel={option => option.name}
                  //                     // getOptionValue={option => option.id}
                  //                     // onCreateOption={(e) => console.log(e)}
                  //                     // loadFunction={}
                  //                     // defaultValue={users}
                  //                     selectedGroup={selectedGroup}
                  //                     as={Creatable}
                  //                     // isCreatable
                  //                     // isClearable
                  //                     // isSearchable
                  //                     isMulti
                  //                     // isSearchable={false}
                  //                     // closeMenuOnSelect={false}
                  //                     placeholder="Enter user emails to submit invite"
                  //                     styles={CUSTOM_STYLES}
                  //                     theme={theme => ({
                  //                         ...theme,
                  //                         ...SELECT_THEME,
                  //                     })}
                  //         />
                  //       </div>
                  //       <div className="ng-width-2-12 ng-margin-bottom ng-padding-remove">
                  //         <Controller as={Select} control={control} className="marapp-qa-provider"
                  //                 name="provider"
                  //                 options={[{name: 'Viewer'}, 'Admin', 'Editor']}
                  //                 isSearchable
                  //                 // placeholder="Select layer provider"
                  //                 styles={CUSTOM_STYLES}
                  //                 theme={theme => ({
                  //                   ...theme,
                  //                   ...SELECT_THEME,
                  //                 })}
                  //                 rules={{required: true}}/>
                  //       </div>
                  //     </div>
                  //   </>
                  // )
                  // }}
                >
                  <div className="ng-grid">
                    <div className="ng-width-1-1">
                      <p className="ng-text-weight-bold">Add users to {selectedGroup}:</p>
                    </div>
                    <div className="ng-width-10-12">
                      <Controller
                        name="users"
                        type="users"
                        className="marapp-qa-invite-users"
                        control={control}
                        // getOptionLabel={option => option.name}
                        // getOptionValue={option => option.id}
                        // onCreateOption={(value) => {
                        //   if (validEmail(value)) {
                        //     setSelectedUsers([...selectedUsers, value]);
                        //   }
                        //   // console.log('**', value, validEmail(value));
                        //   // return validEmail(value) ? undefined : false;
                        // }}
                        // loadFunction={}
                        // defaultValue={users}
                        selectedGroup={selectedGroup}
                        // defaultValue={{label: 'Viewer', value: 'Viewer', hasError: true}}
                        as={Creatable}
                        formatCreateLabel={(value) => `${value}`}
                        isValidNewOption={(value) => validEmail(value)}
                        // isCreatable
                        // isClearable
                        // isSearchable
                        isMulti
                        // isSearchable={false}
                        // closeMenuOnSelect={false}
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
                            className="ng-button ng-button-primary ng-button-large ng-margin-medium-right marapp-qa-actionsubmit"
                            onClick={addUsersHandler}
                          >
                            Add users
                          </button>
                          <button
                            className="ng-button ng-button-primary ng-button-large ng-margin-medium-right marapp-qa-actionsubmit"
                            onClick={cancelUsersHandler}
                            disabled={!formState.dirty}
                          >
                            cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </InlineEditCard>
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
                      itemsRenderer={(items, ref) => (
                        <tbody className="list" ref={ref}>
                          {items}
                          <tr>
                            <td className="ng-border-remove" colSpan={2}>
                              <div className="ng-padding-medium ng-position-relative">
                                {isLoading && <Spinner size="small" />}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      )}
                      awaitMore={awaitMore}
                      pageSize={PAGE_SIZE}
                      itemCount={users.length}
                      renderItem={(index) => {
                        const user = users[index];
                        return (
                          <tr
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
                      onIntersection={() => {
                        setCurrentPage(currentPage + 1);
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
