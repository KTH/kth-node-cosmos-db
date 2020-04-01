# Jest mockups

This directory contains mockups of external modules.

All mockups in this directory will be automatically activated by Jest in any test, even with the default option "automock=false". You don't have to call `jest.mock()` for those.

On the contrary, you might want to call `jest.unmock()` or `jest.requireActual()` in case you need access to the original module.
