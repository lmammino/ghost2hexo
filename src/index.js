#!/usr/bin/env node
'use strict'

const info = require('../package.json')
const path = require('path')
const fs = require('fs')
const YAML = require('yamljs')

const args = process.argv
const source = args[2] || null
const dest = args[3] || null

const usage = () => {
  console.log(
    `
    ghost2hexo version ${info.version}
    ${info.description}

    Usage:

        ghost2hexo <source> <dest>

        source  - source data json file from Ghost export
        dest    - an existing destination folder
  `)
}

if (!source || !dest) {
  console.log('Missing one or more arguments.')
  usage()
  process.exit(1)
}

if (source === '--help') {
  usage()
  process.exit(0)
}

const absDest = path.resolve(dest)
if (!fs.existsSync(absDest)) {
  console.error(`"${absDest}" does not exist`)
  process.exit(1)
}

const destStat = fs.lstatSync(absDest)
if (!destStat.isDirectory()) {
  console.error(`"${absDest}" is not a valid directory`)
  process.exit(1)
}

const createMap = (collection) => {
  return collection.reduce((map, entry) => {
    map[entry.id] = entry
    return map
  }, {})
}

const data = require(path.resolve(source))
const posts = data.db[0].data.posts
const authors = data.db[0].data.users
const tags = data.db[0].data.tags
const postsTags = data.db[0].data.posts_tags
const authorsMap = createMap(authors)
const tagsMap = createMap(tags)
const postsTagsMap = postsTags.reduce((map, entry) => {
  if (!map.hasOwnProperty(entry.post_id)) {
    map[entry.post_id] = []
  }
  map[entry.post_id].push(tagsMap[entry.tag_id].slug)
  return map
}, {})

const createPost = (post, dest, authorsMap) => {
  const destFile = post.page
    ? path.join(dest, '..', `${post.slug}.md`)
    : path.join(dest, `${post.published_at.toString().substr(0, 10)}_${post.slug}.md`)

  const content =
`---
uuid:             ${YAML.stringify(post.uuid)}
layout:           post
title:            ${YAML.stringify(post.title)}
slug:             ${YAML.stringify(post.slug)}
subtitle:         ${YAML.stringify(post.meta_description)}
date:             ${YAML.stringify(post.published_at)}
updated:          ${YAML.stringify(post.updated_at)}
author:           ${YAML.stringify(authorsMap[post.author_id].name)}
author_slug:      ${YAML.stringify(authorsMap[post.author_id].slug)}
header_img:       ${YAML.stringify(post.image)}
status:           ${YAML.stringify(post.status)}
language:         ${YAML.stringify(post.language)}
meta_title:       ${YAML.stringify(post.meta_title)}
meta_description: ${YAML.stringify(post.meta_description)}
${YAML.stringify({tags: postsTagsMap[post.id]}, 2, 2)}
---

${post.markdown}
`
  fs.writeFile(destFile, content, 'utf8', (err) => {
    if (err) {
      return console.error(err)
    }
    console.log(` ✔︎ ${destFile}`)
  })
}

posts.forEach((post) => createPost(post, absDest, authorsMap))
