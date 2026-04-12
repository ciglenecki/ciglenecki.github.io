# image resize

SIZE=120; INPUT=./me.jpeg; OUTPUT=./me.webp; convert $INPUT -resize "${SIZE}x${SIZE}^" -gravity center -extent "${SIZE}x${SIZE}" -quality 95 $OUTPUT




SIZE=64; -resize "${SIZE}x${SIZE}^" -gravity center -extent "${SIZE}x${SIZE}" -quality 100