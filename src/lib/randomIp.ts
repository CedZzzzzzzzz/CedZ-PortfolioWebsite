function randomOctet(): number {
  return Math.floor(Math.random() * 254) + 1
}

export function createRandomIp(): string {
  const networkClass = Math.floor(Math.random() * 3)

  if (networkClass === 0)
    return `10.${randomOctet()}.${randomOctet()}.${randomOctet()}`
  if (networkClass === 1)
    return `172.${Math.floor(Math.random() * 16) + 16}.${randomOctet()}.${randomOctet()}`
  return `192.168.${randomOctet()}.${randomOctet()}`
}
