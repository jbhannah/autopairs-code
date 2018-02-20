# AutoPairs for VS Code

Brings additional [AutoPairs][]-like functionality to Visual Studio Code.

## Features

* Automatically add and remove padding inside pairs of curly braces, square
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

## Extension Settings

This extension contributes the following settings:

* `autopairs-code.enable`: enable/disable this extension
* `autopairs-code.spacing.enable`: enable/disable bracket spacing
* `autopairs-code.spacing.enableForBraces`: enable spacing for curly braces `{}`
* `autopairs-code.spacing.enableForBrackets`: enable spacing for square brackets `[]`
* `autopairs-code.spacing.enableForParentheses`: enable spacing for parentheses `()`

## Known Issues

## Release Notes

## Credits

Bracket pair padding adapted from [Spaces Inside Braces][sib], copyright © 2017
by Julian Tu. Licensed under the terms of the MIT License.

Documentation examples adapted from [AutoPairs][], copyright © 2011-2013 Miao
Jiang. Licensed under the terms of the MIT License.

[AutoPairs]: https://github.com/jiangmiao/auto-pairs
[sib]: https://github.com/AiryShift/spaces-inside-braces
