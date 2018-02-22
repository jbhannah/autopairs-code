# AutoPairs for VS Code

Brings additional [AutoPairs][]-like functionality to [Visual Studio Code][vsc].

## Features

* Automatically add and remove spacing inside pairs of curly braces, square
  brackets, and parentheses.

    ```text
    input: {|} (press <SPACE> at |)
    output: { | }

    input: { | } (press <BACKSPACE> at |)
    output: {|}

    input: "|" (press <SPACE> at |)
    output: " |"
    ```

* Quick jumping across whitespace over closing brackets.

    ```text
    input: {|} (press <SPACE>foo} at |)
    output: { foo }|

    input:
    {
        something;|
    }

    (press } at |)

    output:
    {
        something;
    }|
    ```

* Commands to globally toggle the extension, jumping, and bracket spacing.

## Requirements

This extension requires VS Code version 1.20.0 or higher.

## Extension Settings

This extension contributes the following settings:

* `autopairs-code.enable`: Set to false to completely disable AutoPairs
  behavior.
* `autopairs-code.jumping.enable`: Set to false to completely disable jumping
  over closing brackets.
* `autopairs-code.jumping.enableForBraces`: Enable jumping over closing curly
  braces `{}`.
* `autopairs-code.jumping.enableForBrackets`: Enable jumping over closing square
  brackets `[]`.
* `autopairs-code.jumping.enableForParentheses`: Enable jumping over closing
  parentheses `()`.
* `autopairs-code.spacing.enable`: Set to false to completely disable spacing
  inside bracket pairs.
* `autopairs-code.spacing.enableForBraces`: Enable spacing inside curly braces
  `{}`.
* `autopairs-code.spacing.enableForBrackets`: Enable spacing inside square
  brackets `[]`.
* `autopairs-code.spacing.enableForParentheses`: Enable spacing inside
  parentheses `()`.

## Development

```bash
yarn install
# or
npm install

code .
```

Run the default debug configurations inside VS Code. You local development copy
will override any version installed from the marketplace.

## Credits

Bracket pair padding adapted from [Spaces Inside Braces][sib], copyright © 2017
Julian Tu. Licensed under the terms of the MIT License.

Inspired by and documentation examples adapted from [AutoPairs][], copyright ©
2011-2013 Miao Jiang. Licensed under the terms of the MIT License.

[AutoPairs]: https://github.com/jiangmiao/auto-pairs
[sib]: https://github.com/AiryShift/spaces-inside-braces
[vsc]: https://code.visualstudio.com/
