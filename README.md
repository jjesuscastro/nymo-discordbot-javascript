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
- /nymo setalias <#secret-channel> \<alias-name> \<alias-avatar-url>
  - sets an alias for the <#secret-channel>
- /nymo message \<message>
  - must be used in secret channels
  - will send a message to the public channel using the alias assigned to the secret channel
