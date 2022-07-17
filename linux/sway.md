# Sway

[Sway home page](https://github.com/swaywm/sway/wiki#login-managers)
[Manjaro Sway](https://github.com/Manjaro-Sway/manjaro-sway)

## Config
By default the config for Manjaro + Sway is in `/etc/sway`.

That config will be updated whenever the config is updated [github](https://github.com/Manjaro-Sway/desktop-settings/tree/sway/community/sway/etc/sway).

By default Sway config is loaded from `~/.config/sway/config`. you should see a bunch of `include` from the `/etc/sway`. You can copy those files, change them, and including in the config file instead.


## Clipboard

Manjaro + Sway uses [cliphist](https://github.com/redguardtoo/cliphist) as a clipboard manager.

Usefuld commands:
- List the clipboard content `cliphist list`
- Remove all the clipboard content `rm ~/.cache/cliphist/db

For removing the clipboard content on shutdown:
You can add `set $purge_cliphist_logout true` and request in your config

## Copy to clipboard in VIM
Last time I check VIM doesn't support Wayland clipboard natively. The best work-around I found is to map a key to interact with Wayland terminal.

In your `~/.vimrc` add the mapping:
```
xnoremap <silent> <leader>y y:call system("wl-copy --trim-newline", @0)<cr>:call system("wl-copy -p --trim-newline", @0)<cr>
```

On detail this would do:
```
# only on select (x) norecursive map
xnoremap
# Do not echo the command
<silent>
# Whenever you press the leader key +y
<leader>y
# Yank the selected text
y
# call wl-copy with the information of the register 0 (the latest one you yanked)
call system("wl-copy --trim-newline", @0)<cr>
# same as before but copying to the main clipboard as well
:call system("wl-copy -p --trim-newline", @0)<cr>
```

## configuring XKB for replace symbols
Sway uses XKB for mappig symbols ([wayland protocol](https://wayland-book.com/introduction/high-level-design.html#xkbcommon))

In order to replace some keys by others we can do:

### Set the layout file


Create a file (i.e.: file `/home/jesus/.xkb/symbols/jesus_custom` )

```
default partial alphanumeric_keys
xkb_symbols "basic" {
	include "us"
	name[Group1] = "English (US, Jesus customize)";
	key <FK02> { [2, @, F2, F2, XF86Switch_VT_2] };
    key <CAPS> { [Control_L, Control_L ]};
};
```

On detail this would do:
```
	# include the "us" layout, so your custom layout will share all the us mapping
	include "us"
	# set a new for your layout	
	name[Group1] = "English (US, Jesus customize)";
	# map the keys you want (the first oen is normal, second one is with shift)
	key <FK02> { [2, @, F2, F2, XF86Switch_VT_2] };
```

### Use your custom layout

You need change the Sway config to use your layout.
File: `~/.config/sway/inputs/default-keyboard`
```
input type:keyboard xkb_layout "jesus_custom"
```
(remember to change the sway cofing to include this input.

You can get the names of your inputs by running: `swaymsg -t get_inputs`

Read `man 5 sway-input` for more information about this section.




