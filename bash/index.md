# Bash
## Commands in terminal

### set
[gnu.org](https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html)

Set usually is set at the beginning of the script. The script will behave as `set`, the moment is executed.

```
# Inmmediately exit the script if one command fails
set -e

# To set it back as normal you can do
set +e

# Prints each characters that gets executed
set -x
```

### Special characters
```
space, tab, newline => Separates arguments, if you write several in a row they will be ignored
$ (expansion) => Parameter expansion $PWD, command substitution $(command), arithmetic expansion $((expression))
'' (single quotes) => Allows literal meaning, bash won't try to interpretate them
"" (double quotes) => Text inside won't split from spaces
\ (Escape) => Escape characters, doesn't work inside sigle quotes
# (Comment) => Comments
[[]] (test) => Test true or false conditions
! (exclamation mark) => Negation
<> (more, less) => Redirection
| (pipe) => Redirection to another command
; (command separator) => Represents a new line when commands are in the same one
{} (Inline group) => Commands inside will be treated as one command
() (Subshell group) => Commands inside will be executed in a subshell
(()) (Aritmetic expression) => Used for variables assigments or tests
~ (Home directory) => Used to represent home directory as ~/Documents or ~jesus/Documents (same)
```
