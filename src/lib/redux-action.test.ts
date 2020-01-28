import { createActionCreator, isType } from './redux-action';

describe('redux-action', () => {
  test('createActionCreator', () => {
    const signin = createActionCreator<{ name: string }>('SIGNIN');
    const signinAction = signin({ name: 'ulrik' });
    expect(signinAction).toEqual({
      type: 'SIGNIN',
      payload: {
        name: 'ulrik'
      }
    });
    expect(signin.toString()).toEqual('SIGNIN');
  });

  test('isType', () => {
    const signin = createActionCreator<{ name: string }>('SIGNIN');
    const signout = createActionCreator('SIGNOUT');
    const signinAction = signin({ name: 'ulrik' });
    const signoutAction = signout();
    expect(isType(signinAction, signin)).toEqual(true);
    expect(isType(signinAction, signout)).toEqual(false);
    if (isType(signinAction, signin)) {
      expect(signinAction.payload.name).toEqual('ulrik');
    } else {
      fail();
    }
  });
});
