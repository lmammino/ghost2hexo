# ghost2hexo

A quick'n'dirty command line tool written in Node.js to convert
[Ghost](https://ghost.org) JSON exported posts into a set of source posts for
[Hexo](https://hexo.io)... Long story short, an helper to migrate from Ghost to
Hexo (and probably other static website publishing platforms).


## Install

With Node.js and Npm installed, as easy as:

```bash
npm install -g ghost2hexo
```


## Usage

From your terminal of choice:

```bash
ghost2hexo ghost_data.json path/to/hexo/source/_posts
```

Where:
  - `ghost_data.json`: is the file exported from the Ghost admin
  - `path/to/hexo/source/_posts`: the posts folder of your local Hexo project


## Quick migration guide

1. Prepare your Hexo environment (you can follow the official [quick start](https://hexo.io/docs))
2. Login into your Ghost admin
3. Go to Settings > Labs and click the blue "Export" button (this will download
  the ghost data JSON file)
4. Download your images and files from the `contents/images` folder of your ghost installation
5. Use the `ghost2hexo` command to generate the posts for Hexo
6. Copy your Ghost images into the your Hexo `sources`
7. Regenerate your static website with `hexo generate`


## Contribute

Feel more than welcome to
[report bugs](https://github.com/lmammino/ghost2hexo/issues) or [propose changes](https://github.com/lmammino/ghost2hexo/pulls).

## License

Licensed under [MIT](https://github.com/lmammino/ghost2hexo/blob/master/LICENSE).
