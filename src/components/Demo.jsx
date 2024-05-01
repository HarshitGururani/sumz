import { useState, useEffect } from 'react';
import { copy, loader, tick, linkIcon } from '../assets';
import { useLazyGetSummaryQuery } from '../services/article';
const Demo = () => {
  const [article, setArcticle] = useState({
    url: '',
    summary: '',
  });
  const [allArticle, setAllArticle] = useState([]);
  const [copied, setCopied] = useState('');

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    );
    if (articlesFromLocalStorage) {
      setAllArticle(articlesFromLocalStorage);
    }
  }, []);

  const handelSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };

      const updatedAllArticles = [newArticle, ...allArticle];

      setArcticle(newArticle);
      setAllArticle(updatedAllArticles);

      localStorage.setItem('articles', JSON.stringify(updatedAllArticles));

      console.log(newArticle);
    }
  };

  const handelCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className='mt-16 w-full max-w-xl '>
      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center'
          onSubmit={handelSubmit}
        >
          <img
            src={linkIcon}
            alt='link icon'
            className='absolute left-0 my-2 ml-3 w-5'
          />
          <input
            type='url'
            placeholder='Enter a url'
            value={article.url}
            onChange={(e) => setArcticle({ ...article, url: e.target.value })}
            required
            className='url_input peer'
          />
          <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-800'
          >
            ←
          </button>
        </form>

        {/* Browse url history */}

        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticle.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArcticle(item)}
              className='link_card'
            >
              <div className='copy_btn' onClick={() => handelCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt='copy_icon'
                  className='w-40% h-40% object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* display Results */}

      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Well, that wasn&apos;t supposed to happen... <br />
            <span className='font-satoshi font-normal text-gray-700'>
              {error.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-700 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};
export default Demo;
