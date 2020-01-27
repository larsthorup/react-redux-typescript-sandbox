export interface AnyAction {
  type: any;
}

export interface Action<Payload> extends AnyAction {
  type: string;
  payload: Payload;
}

export interface ActionCreator<Payload> {
  type: string;
  (payload: Payload): Action<Payload>;
}

export function isType<Payload>(
  action: AnyAction,
  actionCreator: ActionCreator<Payload>
): action is Action<Payload> {
  return action.type === actionCreator.type;
}

export function createAction<Payload = void>(
  type: string
): ActionCreator<Payload> {
  return Object.assign(
    (payload: Payload) => {
      const action: Action<Payload> = {
        type,
        payload
      };
      return action;
    },
    {
      type,
      toString: () => type
    }
  ) as ActionCreator<Payload>;
}
