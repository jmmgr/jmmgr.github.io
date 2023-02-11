# Bluetooth

## Content


## Commands

### Basic ls commands

Bluetooth are considered USB buses. As USB, they will appear in the `lsusb` command, i.e.:

```
..
Bus 001 Device 006: ID 8087:0a2b Intel Corp. Bluetooth wireless interface
...
```

This will tell you the Bus, device and the chip (`8087:0a2b`). Which may help you out to to debug.

### hciconfig

hciconfig will list the Bluetooth controllers and their status. I.e.`hciconfig -a` will show you all the controllers.
You can turn controllers up or down:

```
hcicofig hci0 up
hcicofig hci0 down
```

I don't recommend to use hciconfig to manage the bluetooth controllers, as is not installed in all linux distros, and you can use `bluetooothctl`. But is a good command to get information of the bluetooth, like the MAC address.


### bluetoothctl
This is the best command to manage the bluetooth.


if you run `bluetoothctl` it will start a console where is possible to run commands.

#### Controllers
You can list all the controllers with `bluetoothctl list`:

```
Controller 44:85:00:3D:88:B1 jesus-manjaro-home [default]
```

The default is the one that is using.

As well, you can change the controller that is using:

```
bluetoothctl select XX:XX:XX:XX:XX:XX
```

But this will only work for that session. Unfortunately, when the kernel choose a controler by default, you can't change it by default.
You will need to make the kernel to ignore the default one, in order to use another on.

[here is a good example](https://unix.stackexchange.com/questions/314373/permanently-disable-built-in-bluetooth-and-use-usb).

You will need to get the vendor and product from `lsub`:

```
Bus 004 Device 006: ID 0b05:179c ASUSTek Computer, Inc. Bluetooth Adapter
```

And create a file `/etc/udev/rules.d/81-bluetooth-hci.rules`:

```
SUBSYSTEM=="usb", ATTRS{idVendor}=="0b05", ATTRS{idProduct}=="179c", ATTR{authorized}="0"
```

Basically you are unauthorizing it.

#### Devices

```
# Get paired devices
bluetoothctl devices Paired
```


```
# Scan devices
bluetoothctl scan on
bluetoothctl scan off
```

```
# Pair a device
bluetoothctl pair XX:XX:XX:XX:XX:XX
```

```
# Get help
bluetoothctl help
```

