interface Token {
    type: string;
    value?: string | Token[];
}
declare function parse(str: any): never[];
declare function program(str: string, tokens: Token[]): string;
declare function expr0(str: string, tokens: Token[]): string;
declare function expr1(str: string, tokens: Token[]): string;
declare function expr2(str: string, tokens: Token[]): string;
declare function expr3(str: string, tokens: Token[]): string;
declare function num(str: string, tokens?: Token[]): string;
