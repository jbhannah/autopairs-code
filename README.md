# AutoPairs for VS Code

Brings additional [AutoPairs][]-like functionality to Visual Studio Code.

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

## Requirements

This extension requires VS Code version 1.20.0 or higher.

## Extension Settings

This extension contributes the following settings:

* `autopairs-code.enable`: Set to false to completely disable AutoPairs behavior.
* `autopairs-code.spacing.enable`: Set to false to completely disable spacing inside bracket pairs.
* `autopairs-code.spacing.enableForBraces`: Enable spacing inside curly braces `{}`.
* `autopairs-code.spacing.enableForBrackets`: Enable spacing inside square brackets `[]`.
* `autopairs-code.spacing.enableForParentheses`: Enable spacing inside parentheses `()`.

## Credits

Bracket pair padding adapted from [Spaces Inside Braces][sib], copyright © 2017
by Julian Tu. Licensed under the terms of the MIT License.

Documentation examples adapted from [AutoPairs][], copyright © 2011-2013 Miao
Jiang. Licensed under the terms of the MIT License.

[AutoPairs]: https://github.com/jiangmiao/auto-pairs
[sib]: https://github.com/AiryShift/spaces-inside-braces
