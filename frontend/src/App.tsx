// import { useState } from 'react'
import { useEffect, useState } from 'react';
import CardDataStats from './components/CardDataStats'
import DefaultLayout from './components/Layouts/DefaultLayout';
import Loader from './components/common/Loader';
import { RiStackOverflowFill } from 'react-icons/ri';
import { getRowCount } from './services/dataOperations';

function App() {
  // const [count, setCount] = useState(0)
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);

    const fetchRowCount = async () => {
      const stackRowNum = await getRowCount('stacks');
      const projectRowNum = await getRowCount('projects');
      console.log(stackRowNum)
      console.log(projectRowNum)
    }

    fetchRowCount();
  }, []);


  return (loading ? <Loader /> : 
    <>
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>
          <RiStackOverflowFill />
        </CardDataStats>
      </div>
    </DefaultLayout>
    </>
  );
}

export default App
