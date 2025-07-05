export interface Resource {
  whiteListSources(): readonly string[];
  isSourceAllowed(source: string): boolean;
}

export class ResourceImpl implements Resource {
  constructor(private readonly sources: string[]) {}

  whiteListSources(): readonly string[] {
    return Object.freeze(this.sources);
  }

  isSourceAllowed(source: string): boolean {
    return this.sources.includes(source);
  }
}
