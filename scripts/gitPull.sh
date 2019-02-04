red=`tput setaf 1`
green=`tput setaf 2`
blue=`tput setaf 0`
bgWhite=`tput setab 7`
reset=`tput sgr0`

tab=("co2" "citizenToolKit" "api" "graph" "interop" "eco" "chat"  "survey" "map" "news" "dda" "onepage" );

cd ~/d/modules/

for i in ${!tab[@]}; do 
	echo ""
	echo "${red}${bgWhite}---------------------------------------------"
	echo "------------ ${tab[i]}  --------------------"
	echo "---------------------------------------------${reset}"
	echo ""
	cd ${tab[i]}
	echo "${blue}${bgWhite}GIT STATS${reset}"
	git status -sb
	echo ""
	echo "${blue}${bgWhite}GIT PULL${reset}"
	git pull
	cd ..
done

echo ""
echo "${red}${bgWhite}---------------------------------------------"
echo "------------ PIXELHUMAIN-----------------"
echo "---------------------------------------------${reset}"
echo ""
cd ~/d/pixelhumain
rm -f ph/protected/runtime/application.log
rm -Rf ph/assets/*

echo "${blue}${bgWhite}GIT STATS${reset}"
git status -sb
echo ""
echo "${blue}${bgWhite}GIT PULL${reset}"
git pull
