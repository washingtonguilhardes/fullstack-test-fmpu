export interface IExternalClientService<Command = unknown, Response = unknown> {
  send(command: Command): Promise<Response>;
}

export abstract class ExternalClientService<
  Command = unknown,
  Response = unknown,
> implements IExternalClientService<Command, Response>
{
  abstract send(command: Command): Promise<Response>;
}
