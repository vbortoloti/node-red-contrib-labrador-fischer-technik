
import caninos_sdk as k9
from cgi import test
import threading
import time
import sys

try:
    raw_input          # Python 2
except NameError:
    raw_input = input  # Python 3

run = True

def getGpio(labrador, pin_to_enable):
    pin_to_enable = f"pin{pin_to_enable}"
    if hasattr(labrador, pin_to_enable):
        pin = getattr(labrador, pin_to_enable)
        pin.enable_gpio(k9.Pin.Direction.INPUT, alias="input")

def Read():
    count = 0
    pin = int(sys.argv[1])
    labrador = k9.Labrador()
    getGpio(labrador,pin)
    lastRead  = labrador.input.read()
    print(lastRead)
    while run:
        read  = labrador.input.read()
        if read != lastRead:
            lastRead = read
            count += 1
            if(count == 128):
                print(read)
                count = 0


readThread = threading.Thread(target=Read)
readThread.start()

while True:
    data = raw_input()
    if 'close' in data:
        run = False
        sys.exit(0)




