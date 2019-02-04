#How to use scripts
on your home "~" create an alias called "d" pointing to where your communecter folders are 
ln -s /var/www/dev/ d

This way all scripts on any machine will work because they call 
cd ~/d/modules/

## gitCheckout.sh 
will run through all active repos and switch to the given branch
```
./d/pixelhumain/scripts/gitCheckout.sh master 
./d/pixelhumain/scripts/gitCheckout.sh development
```

## gitPull 
will run through all active repos and git pull
```
./d/pixelhumain/scripts/gitPull.sh
```