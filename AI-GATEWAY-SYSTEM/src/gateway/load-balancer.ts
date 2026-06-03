export class LoadBalancer {
  private servers: string[] = [];
  private current = 0;

  register(server: string) {
    this.servers.push(server);
  }

  getNextServer() {
    if (!this.servers.length) {
      throw new Error('No available servers');
    }

    const server = this.servers[this.current];

    this.current = (this.current + 1) % this.servers.length;

    return server;
  }
}