## image resize

SIZE=120; INPUT=./me.jpeg; OUTPUT=./me.webp; convert $INPUT -resize "${SIZE}x${SIZE}^" -gravity center -extent "${SIZE}x${SIZE}" -quality 95 $OUTPUT



SIZE=64; conver ____ -resize "${SIZE}x${SIZE}^" -gravity center -extent "${SIZE}x${SIZE}" -quality 100

## writing checklist

1. a/an/the before nouns
2. "but" => ", but"
3. check "its" vs "it's"

## generating code styles

```
hugo gen chromastyles --style=pygments > themes/matej/static/css/syntax.css
```