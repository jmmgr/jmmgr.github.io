# Yubikeys

## Content

<!-- toc -->

- [Introduction](#introduction)
- [SSH](#ssh)
  * [Debugging](#debugging)
- [Sign github commits](#sign-github-commits)

<!-- tocstop -->

## Introduction

Common problems with Yubikey


## SSH

We can extract the ssh keys from the GPG as:
```
gpg --export-ssh-key key_id
```


### Debugging

First, lets make sure that GPG can detect the card
```
gpg --card-status
```

Then lets make sure that ssh can read the keys

```
ssh-add -l
```

When empty means ssh can't read the keys check the env variable
```
echo $SSH_AUTH_SOCK
```

If is empty, probably we haven't set it correcty, add in your `~/.zshrc`:
```
export SSH_AUTH_SOCK=$(gpgconf --list-dirs agent-ssh-socket)
```

If is printing the right information maybe the problem is with the pinentry, make sure that your file `~/.gnupg/gpg-agent.conf` has something like:
```
enable-ssh-support
default-cache-ttl 60
max-cache-ttl 120
pinentry-program /usr/bin/pinentry-gtk-2
```

This pientry is the one I like the most in Manjaro. The pientry-tty is a mess, if you are using Tmux you will need to inform the env variable ```export GPG_TTY="$(tty)"``` everytime you change your window (or the pinentry input will be asking in other windows).


Need to confirm if ```# gpg-connect-agent updatestartuptty /bye >/dev/null``` in ```~/.zshrc``` is useful or not

[Nice link setup for ssh](https://0day.work/using-a-yubikey-for-gpg-and-ssh/)

## Sign github commits

1. Add the public gpg key in github, you can export the GPG you want like
```
gpg --export --armor XXX
```

2. Set the proper git global config
```
git config --global gpg.program gpg2
git config --global user.signingkey XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
git config --global commit.gpgsign true
```

3. We can verify in the file `~/.gitconfig` that the params are correct

## GPG agent forwarding through ssh
Good explanation in the [wiki](https://wiki.gnupg.org/AgentForwarding)

Usually you will forward the `extra` socket, this socket is more secuire, it allows less operaions.
```
gpgconf --list-dir agent-extra-socket
```

And you will forward in the normal socket of the remote
```
gpgconf --list-dir agent-socket
```

So in your ssh.conf should be like
```
Host name-host
  # The format is <remote socket> <local socket>
  RemoteForward /run/user/1000/gnupg/S.gpg-agent /run/user/1000/gnupg/S.gpg-agent.extra
  ForwardAgent yes
```

Thinks to have in account:
- modify the server setgins to they have `StreamLocalBindUnlink yes`
- if in the remote server, when you login the file `RemoteForward /run/user/1000/gnupg/S.gpg-agent` doesn't exist, you may need to add `gpgconf --create-socketdir` on the `~/.bashrc` (read the wiki)


Remember that you need the public key imported in the remote.

### How to test it

You can test encrypting and derytping a file in the remote server

```
echo 'hola' > hola.txt
gpg --encrypt --recipient jesu@gmail.com hola.txt
gpg --decrypt hola.txt.gpg
```
