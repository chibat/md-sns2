/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from "preact";

import type { User } from '~/utils/types.ts';

type Props = {
  users: User[];
};

export default function Users(props: Props) {

  function go(userId: number) {
    location.href = `/users/${userId}`;
  }

  // <a href で遷移しない

  return (
    <>
      {props.users.map(user =>
        <div class="mb-3" key={user.userId}>
          <img src={user.picture} alt="mdo" width="32" height="32" class="rounded-circle me-2" />
          <a href="#" onClick={() => go(user.userId)} class="noDecoration">{user.name}</a>
        </div>
      )}
    </>
  );
}
