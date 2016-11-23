

FILE=$1
DIR=$(pwd)

sed -i 1,2d $FILE

echo "$(awk '{printf "%d,%s\n", NR, $0}' < $FILE)" > /tmp/data_tmp.csv
rm -rf /tmp/data.csv
mv /tmp/data_tmp.csv /tmp/data.csv
