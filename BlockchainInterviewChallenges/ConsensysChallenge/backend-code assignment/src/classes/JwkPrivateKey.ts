import { JwkPublicKey } from './JwkPublicKey'

export class JwkPrivateandPublicKey extends JwkPublicKey {
  p: string
  q: string
  d: string
  qi: string
  dp: string
  dq: string
}
