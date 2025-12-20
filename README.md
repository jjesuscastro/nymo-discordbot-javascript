# Nymo Discord Bot 

## Features
- Send anonymous messages through an Alias

## Commands
- /nymo log <#channel-name>
  - sets the <#channel-name> as the log channel
  - all messages will be sent to the log channel with the real original discord ID for moderation
- /nymo setsecret <#secret-channel> <#public-channel>
  - links the <#secret-channel> to the <#public-channel>
  - a <#secret-channel> will have an Alias attached to it, you can set an Alias with the next command
- /nymo setalias <#secret-channel>
  - sets an alias for the <#secret-channel>
  - will open a modal form to input Alias Name and image
- /nymo message \<message>
  - must be used in secret channels
  - will send a message to the public channel using the alias assigned to the secret channel

## Links
- [Terms of Service](https://gist.github.com/jjesuscastro/9cbd0044cb5c47b83ba953f6f7bd4985)
- [Privacy Policy](https://gist.github.com/jjesuscastro/52dcbd8cb6af93c0732ee08084f0d8fe)
