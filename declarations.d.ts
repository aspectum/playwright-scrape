type TidyCallback = (err: any, html: string) => void;
type TidyOptions = Partial<{
  doctype: string;
  hideComments: boolean;
  indent: boolean;
  // more
}>;

declare module "htmltidy2" {
  export const tidy: (
    text: string,
    [options]: TidyOptions,
    callback: TidyCallback
  ) => void;
}
