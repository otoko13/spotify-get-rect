import { createElement } from 'react';
import SpotifyAuthForwarder from './SpotifyAuthForwarder';
import SetForwardPath from './SetForwardPath';

export default function Login() {
  // We want to redirect to spotify auth from an SSC so we hide credentials.
  // But we also want to set the forward path, which can only be done in
  // localstorage from a CSC. So we create the SSC here (in another SSC) and
  // forward it to the CSC, which is the recommended way
  const childComponent = createElement(SpotifyAuthForwarder);

  return <SetForwardPath>{childComponent}</SetForwardPath>;
}
