// src/components/SavedJob.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './savedJobs.css';

function SavedJobPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bước 1: Xác định người dùng hiện tại
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (!user) {
        setError('Vui lòng đăng nhập để xem công việc đã lưu của bạn.');
      } else {
        setError(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Bước 2 & 3: Truy vấn danh sách Job đã lưu và lấy thông tin chi tiết từng Job
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!currentUser) {
        setSavedJobs([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const savedJobsRef = collection(db, 'candidates', currentUser.uid, 'savedJobs');
        const savedJobsSnapshot = await getDocs(savedJobsRef);

        const jobIds = [];
        savedJobsSnapshot.forEach((doc) => {
          jobIds.push(doc.id);
        });

        if (jobIds.length === 0) {
          setSavedJobs([]);
          setLoading(false);
          return;
        }

        const jobDetailsPromises = jobIds.map(async (jobId) => {
          const jobDocRef = doc(db, 'jobs', jobId);
          const jobDocSnap = await getDoc(jobDocRef);
          if (jobDocSnap.exists()) {
            return { id: jobDocSnap.id, ...jobDocSnap.data() };
          }
          return null;
        });

        const fetchedJobDetails = await Promise.all(jobDetailsPromises);
        setSavedJobs(fetchedJobDetails.filter(job => job !== null));
      } catch (err) {
        console.error("Lỗi khi tải công việc đã lưu:", err);
        setError('Không thể tải danh sách công việc đã lưu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchSavedJobs();
    } else if (currentUser === null && !loading) {
      setSavedJobs([]);
    }
  }, [currentUser]);

  // Bước 4: Hiển thị dữ liệu
  if (loading) {
    return (
      <div>
        <p>Đang tải công việc đã lưu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div>
        <p>Vui lòng đăng nhập để xem công việc đã lưu của bạn.</p>
      </div>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <div>
        <p>Bạn chưa lưu công việc nào.</p>
        <p>Hãy khám phá và lưu những công việc bạn yêu thích!</p>
      </div>
    );
  }

  return (
    <div className='saved-job-page'>
      <h1>Công việc đã lưu của tôi</h1>
      <div className="job-list">
        {savedJobs.map((job) => (
          <div key={job.id} className="job-card">
            <h2>{job.title}</h2>
            <p>
              <strong>Công ty:</strong> {job.companyId}
            </p>
            <p>
              {job.description ? job.description.substring(0, 500) + '...' : 'Không có mô tả'}
            </p>
            <a href={`/jobs/${job.id}`}>
              Xem chi tiết
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedJobPage;
