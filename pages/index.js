import { useEffect, useState } from 'react'
import Fuse from 'fuse.js'

const tools = [
  {
    name: 'Test 1,2,3',
    description: `
<p>This is a mock tool in Rust.</p>
<p>To learn more, do nothing!</p>
    `,
    link: 'https://zack.cat',
  },
  {
    name: 'Test 4,5,6',
    description: `
<p>This is a mock tool in Rust.</p>
<p>To learn more, do nothing!</p>
    `,
    link: 'https://zack.cat',
  },
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [result, setResult] = useState([])
  const states = {
    cleared: result.length === 0 && searchTerm === '',
    none: result.length === 0 && searchTerm !== '',
    success: result.length > 0 && searchTerm !== '',
  }

  return (
    <div>
      <h1>Rusted Tools</h1>
      <p>Celebrating cli tools written in Rust.</p>
      <FuzzySearch choices={tools} term={searchTerm} setResult={setResult} />
      <SearchBar term={searchTerm} set={setSearchTerm} />
      {states.cleared && (
        <ul>
          {tools.map((tool) => (
            <li key={tool.name}>
              <Tool tool={tool} />
            </li>
          ))}
        </ul>
      )}
      {states.success && (
        <ul>
          {result.map(({ item: tool }) => (
            <li key={tool.name}>
              <Tool tool={tool} />
            </li>
          ))}
        </ul>
      )}
      {states.none && <p>No results for {searchTerm}.</p>}
    </div>
  )
}

function Tool({ tool: { name, description, link } }) {
  return (
    <a href={link}>
      <article>
        <h1>{name}</h1>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </article>
    </a>
  )
}

function FuzzySearch({ choices, term, setResult }) {
  const [fuse, setFuse] = useState(null)
  const options = {
    includeScore: true,
    keys: ['name', 'description'],
  }
  useEffect(() => {
    setFuse(new Fuse(choices, options))
  }, [choices])
  useEffect(() => {
    setResult(term === '' ? [] : fuse.search(term, options))
  }, [term])

  return null
}

function SearchBar({ term, set }) {
  return (
    <div>
      <input
        type="text"
        value={term}
        onChange={(event) => {
          set(event.target.value)
        }}
      />
      {term !== '' && (
        <button onClick={() => set('')} type="button">
          Reset Search
        </button>
      )}
    </div>
  )
}

/** @type {import("next").GetStaticProps} */
export async function getStaticProps() {
  return {
    props: {
      tools,
    },
    revalidate: true,
  }
}
