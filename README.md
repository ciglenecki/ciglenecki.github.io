# image resize

SIZE=200; convert input.jpg -resize "${SIZE}x${SIZE}^" -gravity center -extent "${SIZE}x${SIZE}" -quality 92 output.jpg

SIZE=200; INPUT=static/project-images/stylegan2ada_faces.png; convert $INPUT -resize "${SIZE}x${SIZE}^" -gravity center -extent "${SIZE}x${SIZE}" -quality 92 $INPUT