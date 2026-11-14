# Site fonts

Fredoka and Instrument Sans (both SIL Open Font License 1.1), as variable fonts with their `wght`
and `wdth` axes, cut down to the characters this site renders. The cut saves about a third of the
bytes, and on a phone these two files are most of what loads before the first paint.

Sources: the Google Fonts "latin" files for `Fredoka:wdth,wght` and `Instrument Sans:wdth,wght`.
To rebuild after adding text with characters outside the set below:

```sh
pip install fonttools brotli
UNICODES="U+0020-007E,U+00A0,U+00A9,U+00AE,U+00B7,U+00C9,U+00D7,U+00E0-00E4,U+00E7-00EB,U+00ED,U+00F1,U+00F3,U+00F6,U+00FA,U+00FC,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+20B9,U+2190-2195,U+2197,U+21BA,U+2713,U+2715,U+25A3"
for font in fredoka instrument-sans; do
  pyftsubset "$font-latin.woff2" --unicodes="$UNICODES" \
    --layout-features='kern,liga,ccmp,locl,mark,mkmk,tnum,pnum' \
    --flavor=woff2 --no-hinting --desubroutinize --output-file="$font-site.woff2"
done
```

`tests/unit/fonts.test.ts` fails if site text uses a character the fonts don't cover.
