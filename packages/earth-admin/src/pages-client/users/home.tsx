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
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import {
  AuthzGuards,
  Card,
  EmailInput,
  ErrorMessages,
  Spinner,
  useDomWatcher,
} from '@marapp/earth-shared';

import { useAuth0 } from '@app/auth/auth0';
import { DeleteConfirmation } from '@app/components/modals/delete-confirmation';
import { ContentLayout } from '@app/layouts';
import UsersService from '@app/services/users';
import { CUSTOM_STYLES, SELECT_THEME } from '@app/theme';
import { encodeQueryToURL, normalizeGroupName } from '@app/utils';
import { useInfiniteListPaged } from '@app/utils/hooks';

const PAGE_SIZE = 10;

interface RolePopupData {
  x?: number;
  y?: number;
  email?: string;
  deleteEmail?: string;
  group?: string;
  visible?: boolean;
  isLoading?: boolean;
  error?: { data?: any[] };
}

export function UsersHome(props: any) {
  const { getPermissions, selectedGroup } = useAuth0();
  const { t } = useTranslation('admin');
  const writePermissions = getPermissions(AuthzGuards.writeUsersGuard);

  const [isLoadingInviteUsers, setIsLoadingInviteUsers] = useState(false);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [serverErrors, setServerErrors] = useState([]);
  const [usersFeedback, setUsersFeedback] = useState([]);
  const [rolePopupData, setRolePopupData] = useState<RolePopupData>({});
  const [showRemoveUser, setShowRemoveUser] = useState(false);

  const getQueryFn = (pageIndex) => {
    const query = {
      page: { size: PAGE_SIZE, number: pageIndex },
      group: selectedGroup,
      include: 'groups',
    };
    return { query, resourceType: 'users' };
  };
  const { listProps: userListProps, mutate } = useInfiniteListPaged(
    getQueryFn,
    UsersService.getAllUsers
  );

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
      const { data } = await UsersService.getAvailableGroups({ group: selectedGroup });
      const groups = data.map((item) => ({
        label: normalizeGroupName(item.name),
        value: item.id,
      }));
      setAvailableGroups(groups);
      setValue(
        'role',
        groups.find((group) => group.label.includes('Viewer'))
      );
    })();
  }, []);

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

    const processUsersFeedback = (data, isSccess) => {
      const feedback = [];

      const feedbackUsers = data.map((item) => {
        const skipped = item.status === 409;
        const hasError = !!item.error && !skipped;
        const hasSuccess = isSccess && (item.status === 200 || skipped);

        feedback.push({
          hasError,
          hasSuccess,
          title: item.email,
          detail: item.error,
          skipped,
        });

        return {
          label: item.email,
          value: item.email,
          hasError,
          hasSuccess,
          skipped,
        };
      });

      setValue('users', feedbackUsers);
      setUsersFeedback(feedback);
    };

    try {
      const data = {
        emails: users.map((user) => user.value),
        groups: [role?.value],
      };
      const response = await UsersService.addUsers(data, { group: selectedGroup });

      processUsersFeedback(response.data, true);

      mutate();
    } catch (err) {
      const errors = err.data?.errors;

      processUsersFeedback(errors ? [] : err.data, false);
      setServerErrors(errors || err.data);
    }

    setIsLoadingInviteUsers(false);
  };

  const cancelUsersHandler = () => {
    setValue('users', [], { shouldDirty: true, shouldValidate: true });
    setServerErrors([]);
    setUsersFeedback([]);
  };

  const toggleRolePopup = (e?: any, user?: any) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    } else {
      mutate();
    }

    if (!user || user.email === rolePopupData.email) {
      setRolePopupData({
        visible: false,
        isLoading: false,
      });

      return;
    }

    const scrollContainer = document.querySelector('.ng-page-container');
    const containerBoundingRect = scrollContainer.getBoundingClientRect();
    const boundingRect = e.target.getBoundingClientRect();

    setRolePopupData({
      email: user.email,
      deleteEmail: user.email,
      group: normalizeGroupName(user.groups[0].name),
      x: boundingRect.left - containerBoundingRect.left,
      y: boundingRect.bottom + window.scrollY,
      visible: true,
    });
  };

  const handleRoleError = (err: any) => {
    setRolePopupData({
      error: {
        data: err?.data?.errors || [],
      },
    });
  };

  const updateUserHandler = async (group: string) => {
    setRolePopupData({
      ...rolePopupData,
      isLoading: true,
    });

    try {
      await UsersService.updateUser(
        rolePopupData.email,
        { groups: [group] },
        { group: selectedGroup }
      );

      await mutate();

      toggleRolePopup();
    } catch (err) {
      handleRoleError(err);
    }
  };

  useDomWatcher(
    () => setRolePopupData({ deleteEmail: rolePopupData.deleteEmail }),
    !rolePopupData.visible,
    '.role-popup'
  );

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
                      <p className="ng-text-weight-bold">
                        {t('Add users to group', { value: selectedGroup })}:
                      </p>
                    </div>
                    <div className="ng-width-10-12">
                      <Controller
                        as={EmailInput}
                        name="users"
                        control={control}
                        defaultValue={[]}
                        isMulti={true}
                        placeholder={t('Enter existing emails to add users to this organization')}
                        className="marapp-qa-invite-users"
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
                        isLoading={availableGroups.length === 0}
                        placeholder={t('Select role')}
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
                        {usersFeedback.map((item) =>
                          item.skipped ? (
                            <p className="ng-margin-remove">
                              {t('Email exists', { value: item.title })}
                            </p>
                          ) : item.hasSuccess ? (
                            <p className="ng-margin-remove">
                              {t('Email invited', { value: item.title })}
                            </p>
                          ) : (
                            item.hasError && (
                              <p className="ng-margin-remove">
                                {t('Email unavailable', {
                                  value: item.title,
                                  details: item.detail,
                                })}
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
                            {t('Add users')}
                          </button>
                          <button
                            className="ng-button ng-button-secondary ng-button-large ng-margin-medium-right marapp-qa-actioncancel"
                            onClick={cancelUsersHandler}
                            disabled={!inviteUsersWatcher?.length}
                          >
                            {t('cancel')}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
              <div className="ng-width-1-1 ng-margin-top">
                <Card>
                  {!!rolePopupData.error && (
                    <div className="ng-background-danger ng-padding-medium">
                      {rolePopupData.error.data.length > 0 ? (
                        <ErrorMessages
                          errors={rolePopupData.error.data}
                          className="ng-color-white"
                        />
                      ) : (
                        <span>
                          {t('Something went wrong')}! {t('Unknown error')}.
                        </span>
                      )}
                      <button
                        className="marapp-qa-error-dismiss ng-background-danger ng-border-remove ng-text-display-m ng-text-weight-thin ng-position-absolute ng-position-top-right ng-padding ng-margin-medium-right ng-margin-medium-top"
                        onClick={() => setRolePopupData({})}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                  <table className="ng-table">
                    <thead>
                      <tr>
                        <th className="ng-border-remove ng-width-1-2">{t('Email')}</th>
                        <th className="ng-border-remove ng-width-1-2">{t('Role and access')}</th>
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
                        const userGroup = normalizeGroupName(user.groups[0].name);
                        return (
                          <tr key={user.email}>
                            <td className="ng-border-remove">{user.email}</td>
                            <td className="ng-border-remove">
                              {userGroup}
                              {availableGroups.find((group) => group.label === userGroup) && (
                                <button
                                  className="ng-border-remove ng-background-ultradkgray ng-color-light role-popup"
                                  onClick={(e) => toggleRolePopup(e, user)}
                                  disabled={rolePopupData.isLoading}
                                >
                                  <i
                                    className={classnames('ng-icon ng-color-white', {
                                      'ng-icon-directionup': rolePopupData.email === user.email,
                                      'ng-icon-directiondown': rolePopupData.email !== user.email,
                                    })}
                                  />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      }}
                    />
                  </table>
                  {rolePopupData.visible && (
                    <div
                      style={{
                        position: 'absolute',
                        left: rolePopupData.x,
                        top: rolePopupData.y - 280,
                      }}
                      className={classnames({
                        'role-popup': true,
                        'ng-inline-card-loading': rolePopupData.isLoading,
                      })}
                    >
                      <ul className="ng-default-dropdown">
                        {rolePopupData.isLoading && (
                          <div className="ng-inline-card-spinner">
                            <i className="ng-icon-spinner ng-icon-spin" />
                          </div>
                        )}
                        {availableGroups.map((group) => (
                          <li
                            className={classnames({
                              selected: group.label === rolePopupData.group,
                            })}
                          >
                            <a
                              className={`marapp-qa-role-${group.label}`}
                              onClick={() => updateUserHandler(group.value)}
                            >
                              {group.label}
                            </a>
                          </li>
                        ))}
                        <li>
                          <hr className="ng-margin-remove" />
                        </li>
                        <li>
                          <a
                            className="marapp-qa-remove-user"
                            onClick={() => setShowRemoveUser(true)}
                          >
                            {t('Remove User')}
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                  <DeleteConfirmation
                    id={rolePopupData.deleteEmail}
                    name={rolePopupData.deleteEmail}
                    navigateRoute="users"
                    type="user"
                    toggleModal={() => setShowRemoveUser(!showRemoveUser)}
                    onDelete={toggleRolePopup}
                    visibility={showRemoveUser}
                    error={handleRoleError}
                  />
                </Card>
              </div>
            </div>
          </>
        )}
      </ContentLayout>
    )
  );
}
