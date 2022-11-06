
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

def Read(countTo):
    count = 0
    pin = int(sys.argv[1])
    labrador = k9.Labrador()
    getGpio(labrador,pin)
    lastRead  = labrador.input.read()
    while count< countTo:
        read  = labrador.input.read()
        if read != lastRead:
            count+=1
            lastRead = read
    print("1")


while True:
        try:
            data = raw_input()
            if 'close' in data:
                sys.exit(0)
            data = int(data)
        except (EOFError, SystemExit):        # hopefully always caused by us sigint'ing the program
            print("erro")
            sys.exit(0)
        if(data > 0):
            Read(data)
        else:
            print('invalid input')
            break

        print("saida: "+str(data))




