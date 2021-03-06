import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import Header from '../../components/Header'
import { Data } from '../../components/utils/formatDate'
import { Keys } from 'faunadb'

const fetcher = url => fetch(url).then(res => res.json())

const Index = () => {
  const router = useRouter()
  const { slug } = router.query
  const { data, error } = useSWR(`/api/releases/`, fetcher)

  if (error) return 'An error has occurred.'
  if (!data)
    return (
      <div className='flex justify-center items-center mt-52'>
        <div
          className={`animate-spin rounded-full h-32 w-32 border-b-8 `}
        ></div>
      </div>
    )
  const result = data.data

  const release = () => {
    let arrayVersion = result.map(i => i.version)
    const v = [...new Set(arrayVersion)]
    return v.map((i) => ({ release: i }))
  }
  return (
    <>
      <Header title={slug.charAt(0).toUpperCase() + slug.slice(1) + ' | Release Notes'} />
      <div className='overflow-hidden grid grid-rows-1 grid-flow-col gap-4 relative '>
        <div className='col-span-2'>
          <Link href='/'>
            <h1 className='p-12 font-sans font-semibold text-2xl hover:cursor-pointer'>
              C&S Sistemas - Release Notes
            </h1>
          </Link>
          <div className='p-12 overflow-y-auto'>
            {result.map((item, index) => (
              <div key={index} className={index === 0 ? '-mt-11' : null}>
                <p className='font-sans font-semibold text-2xl '>
                  {Data(item.date)} - Release {item.version} - <a className='select-none uppercase bg-[#41F353] rounded-full'><b>&nbsp;</b><b>&nbsp;</b>{item.sistema}<b>&nbsp;</b><b>&nbsp;</b></a>
              </p>
                {
                item.description.map((i, index) => (
                  <>
                    <div key={index} className='flex flex-row '>
                      <div className='bg-[#41F353] w-16 h-9 rounded-full'>
                        <p className='select-none font-bold text-xs text-center mt-2'>
                          {i.requisito}
                        </p>
                      </div>
                      <p className='ml-3 mt-2 font-roboto'>{i.title}</p>
                    </div>
                    <div className='max-w-3xl mt-4 ml-20 font-roboto mb-3'>
                      <p className='indent-8'>{i.item}</p>
                    </div>
                  </>
                ))
              }

              </div>
            ))}
        </div>
      </div>
      <div className='hidden row-span-3 mt-28 mb-14 border-l border-black  '>
        <div className='flex flex-col  '>
          {release().map((i) => {
            <Link href='/'>
              <a className='ml-5'>{i.release}</a>
            </Link>
          })}

          <Link href='/'>
            <a className='ml-5 mt-10 hover:text-green-900'>Voltar</a>
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default Index
