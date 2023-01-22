import { Suspense, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';

import { useLoaderData, defer, Await, useAsyncValue, useAsyncError } from 'react-router-dom'

export const loader = async () => {
  // fire them all at once  
  const requiredPromise1 = fetch('/test?text=requiredData1&delay=250').then(res => res.json()).then(res => res.text);
  const requiredPromise2 = fetch('/test?text=requiredData2&delay=500').then(res => res.json()).then(res => res.text);
  const lazyResolvedPromise = fetch('/test?text=blazinglyFastLazyResolved&delay=100').then(res => res.json()).then(res => res.text);
  const lazy1Promise = fetch('/test?text=lazyResolved1000&delay=1000').then(res => res.json()).then(res => res.text);
  const lazy2Promise = fetch('/test?text=lazyResolved1500&delay=1500').then(res => res.json()).then(res => res.text);
  const lazy3Promise = fetch('/test?text=lazyResolved2500&delay=2500').then(res => res.json()).then(res => res.text);
  const lazyErrorPromise = fetch('/test?text=lazyKaboom&delay=3000').then(res => res.json()).then(res => {
    throw new Error(res.text);
  });

  // await for the response
  return defer({
    requiredData1: await requiredPromise1,
    requiredData2: await requiredPromise2,
    lazyButVeryFastData: lazyResolvedPromise,
    lazyData1: lazy1Promise,
    lazyData2: lazy2Promise,
    lazyData3: lazy3Promise,
    lazyError: lazyErrorPromise
  })
}

function RenderAwaitedData() {
  let data = useAsyncValue();
  return <p>{data}</p>;
}

function RenderAwaitedError() {
  let error = useAsyncError();
  return <p style={{ color: "red" }}>
    Oh noes! :(
    <br />
    Error: {error.message}
    <br />
    Stack: {error.stack}
  </p>;
}

function App() {

  const {
    requiredData1,
    requiredData2,
    lazyButVeryFastData,
    lazyData1,
    lazyData2,
    lazyData3,
    lazyError,
  } = useLoaderData();

  const lazyDatas = [
    lazyData1,
    lazyData2,
    lazyData3,
    lazyError,
  ].map(lazyData => (
    <Suspense
      fallback={
        <p>Loading...</p>
      }
    >
      <Await resolve={lazyData} errorElement={<RenderAwaitedError />}>
        <RenderAwaitedData />
      </Await>
    </Suspense>
  ));

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ margin: 5 }}>{requiredData1}</h1>
        <h4 style={{ margin: 5 }}>{requiredData2}</h4>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Wow those lazy data is kind of magic
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          BTW I USE VIM
        </a>
        <Suspense
          fallback={
            <p>Loading... But you will not see me cause my data is BLAZINGLY FAST!</p>
          }
        >
          <Await resolve={lazyButVeryFastData}>
            <RenderAwaitedData />
          </Await>
        </Suspense>
        {lazyDatas}
      </header>
    </div>
  );
}

export default App;
