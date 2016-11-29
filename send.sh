#!/usr/bin/env bash



rm -rf /tmp/send.csv
rm -rf /tmp/dtemp.csv

DATA=/tmp/data.csv


#Create the file to be sent
echo "index,ax,ay,az,gx,gy,gz" > /tmp/send.csv
touch /tmp/dtemp.csv
TEMP=/tmp/dtemp.csv


#Check for broken data lines
while IFS= read -r line
do
	cnt="$(echo "$line" | grep -o "\," | wc -l)"

	if [[ "$cnt" -eq "5" ]]; then
		echo "$line" >> $TEMP
	fi

done < "$DATA"


#Delete the first 3 lines
sed -i 1,3d $TEMP

#insert numbers at the begining
perl -pe 'printf "%9u,", $.' -- $TEMP > /tmp/foo
mv /tmp/foo $TEMP
sed 's/^ *//' $TEMP > /tmp/foo
mv /tmp/foo $TEMP


#add it to send.csv

echo "$(cat $TEMP)" >> /tmp/send.csv

#send the data over http
curl -X POST -F "sampleFile=@/tmp/send.csv" http://ec2-54-212-222-6.us-west-2.compute.amazonaws.com:3000/upload





rm -rf $TEMP
#rm -rf $DATA





