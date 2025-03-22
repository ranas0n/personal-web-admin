// import { useState } from 'react'
import { useEffect, useState } from 'react';
import CardDataStats from './components/CardDataStats'
import DefaultLayout from './components/Layouts/DefaultLayout';
import Loader from './components/common/Loader';
import { RiStackOverflowFill } from 'react-icons/ri';
import { getRowCount } from './services/dataOperations';
import { AiFillProject } from 'react-icons/ai';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [stackRowNum, setStackRowNum] = useState<number>(0);
  const [projectRowNum, setProjectRowNum] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);

    const fetchRowCount = async () => {
      const stackRowRes = await getRowCount('stacks')
      const projectRowRes = await getRowCount('projects')
      setStackRowNum(stackRowRes.data);
      setProjectRowNum(projectRowRes.data);
    }

    fetchRowCount();
  }, []);


  return (loading ? <Loader /> : 
    <>
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Number of Stacks" total={stackRowNum}>
          <RiStackOverflowFill />
        </CardDataStats>
        <CardDataStats title="Total Number of Projects" total={projectRowNum}>
          <AiFillProject />
        </CardDataStats>
      </div>
    </DefaultLayout>
    </>
  );
}

export default App
