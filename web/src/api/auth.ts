import { graphql, request, setToken } from "@/lib/graphql";

const SignUpMutation = graphql(`
  mutation SignUp($email: String!, $playertag: String!, $password: String!) {
    signUp(email: $email, playertag: $playertag, password: $password) { token }
  }
`);

/** Returns true when the player is logged in right away, false when the e-mail must be confirmed first. */
export async function signUp(email: string, playertag: string, password: string): Promise<boolean> {
  const { token } = (await request(SignUpMutation, { email, playertag, password })).signUp;
  if (token) setToken(token);
  return !!token;
}

const LogInMutation = graphql(`
  mutation LogIn($email: String!, $password: String!) { logIn(email: $email, password: $password) { token } }
`);

export async function logIn(email: string, password: string) {
  const { token } = (await request(LogInMutation, { email, password })).logIn;
  setToken(token);
}

const LogOutMutation = graphql(`
  mutation LogOut { logOut }
`);

export async function logOut() {
  await request(LogOutMutation).catch(() => undefined);
  setToken(null);
}

const VerifyEmailMutation = graphql(`
  mutation VerifyEmail($token: String!) { verifyEmail(token: $token) { token } }
`);

export async function verifyEmail(token: string) {
  const session = (await request(VerifyEmailMutation, { token })).verifyEmail.token;
  if (session) setToken(session);
}

const ResendVerificationMutation = graphql(`
  mutation ResendVerification($email: String!) { resendVerification(email: $email) }
`);

export async function resendVerification(email: string) {
  await request(ResendVerificationMutation, { email });
}

const RequestPasswordResetMutation = graphql(`
  mutation RequestPasswordReset($email: String!) { requestPasswordReset(email: $email) }
`);

export async function requestPasswordReset(email: string) {
  await request(RequestPasswordResetMutation, { email });
}

const ResetPasswordMutation = graphql(`
  mutation ResetPassword($token: String!, $password: String!) { resetPassword(token: $token, password: $password) }
`);

export async function resetPassword(token: string, password: string) {
  await request(ResetPasswordMutation, { token, password });
}

const ChangePasswordMutation = graphql(`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`);

export async function changePassword(currentPassword: string, newPassword: string) {
  await request(ChangePasswordMutation, { currentPassword, newPassword });
}

const ChangeEmailMutation = graphql(`
  mutation ChangeEmail($email: String!, $password: String!) { changeEmail(email: $email, password: $password) { id } }
`);

export async function changeEmail(email: string, password: string) {
  await request(ChangeEmailMutation, { email, password });
}
