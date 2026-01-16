import { useEffect, useState } from 'react';
import CardDataStats from './components/CardDataStats';
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
    const fetchRowCount = async () => {
      try {
        const [stackRowRes, projectRowRes] = await Promise.all([
          getRowCount('stacks'),
          getRowCount('projects')
        ]);
        setStackRowNum(stackRowRes.data);
        setProjectRowNum(projectRowRes.data);
      } catch (error) {
        console.error('Error fetching row counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRowCount();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardDataStats title="Total Number of Stacks" total={stackRowNum}>
          <RiStackOverflowFill />
        </CardDataStats>
        <CardDataStats title="Total Number of Projects" total={projectRowNum}>
          <AiFillProject />
        </CardDataStats>
      </div>
    </DefaultLayout>
  );
}

export default App;
