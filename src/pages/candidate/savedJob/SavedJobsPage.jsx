import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './savedJobs.css';
// ⚠️ Giả sử đường dẫn này là đúng đến component JobList và JobDetailModal của bạn
import JobList from '../jobList/JobList';
import JobDetailModal from '../jobList/JobDetailModal';

function SavedJobPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [companyData, setCompanyData] = useState({}); // Thêm state lưu data công ty
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); // State để mở JobDetailModal

  // Bước 1: Xác định người dùng hiện tại
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Giữ loading = true nếu user chưa được xác định để tránh hiển thị lỗi đăng nhập nhanh quá
      if (user !== undefined) setLoading(false); 
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
        // Lấy danh sách Job ID đã lưu
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

        // Lấy thông tin chi tiết từng Job
        const jobDetailsPromises = jobIds.map(async (jobId) => {
          const jobDocRef = doc(db, 'jobs', jobId);
          const jobDocSnap = await getDoc(jobDocRef);
          if (jobDocSnap.exists()) {
            return { id: jobDocSnap.id, ...jobDocSnap.data() };
          }
          return null;
        });

        const fetchedJobDetails = await Promise.all(jobDetailsPromises);
        const validJobs = fetchedJobDetails.filter(job => job !== null);
        setSavedJobs(validJobs);
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

  // Bổ sung: Lấy thông tin công ty cho các job đã lưu
  useEffect(() => {
    const fetchCompanies = async () => {
      if (savedJobs.length === 0) return;
      const companyMap = {};

      const companyIds = [...new Set(savedJobs.map(job => job.companyId))].filter(id => id);

      await Promise.all(companyIds.map(async (companyId) => {
        try {
          const companyRef = doc(db, "companies", companyId);
          const companySnap = await getDoc(companyRef);
          if (companySnap.exists()) {
            companyMap[companyId] = companySnap.data();
          }
        } catch (err) {
          console.error("❌ Error fetching company:", err);
        }
      }));

      setCompanyData(companyMap);
    };

    if (savedJobs.length > 0) fetchCompanies();
  }, [savedJobs]);


  // Hàm xử lý việc mở JobDetailModal
  const handleJobClick = (job) => {
    const company = companyData[job.companyId] || {};
    // Truyền cả job và company cho JobList (nếu JobList được thiết kế để mở modal nội bộ)
    // HOẶC set state ở đây nếu muốn quản lý modal ở cấp độ này
    setSelectedJob({ job, company });
  };
  
  // Hàm xử lý đóng JobDetailModal
  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  // Bước 4: Hiển thị dữ liệu
  if (loading) {
    return (
      <div className='saved-job-page'>
        <h1>Công việc đã lưu của tôi</h1>
        <p>Đang tải công việc đã lưu... ⏳</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='saved-job-page'>
        <h1>Công việc đã lưu của tôi</h1>
        <p className="error-message">❌ {error}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className='saved-job-page'>
        <h1>Công việc đã lưu của tôi</h1>
        <p>Vui lòng đăng nhập để xem công việc đã lưu của bạn. 🔒</p>
      </div>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <div className='saved-job-page'>
        <h1>Công việc đã lưu của tôi</h1>
        <p>Bạn chưa lưu công việc nào. 😞</p>
        <p>Hãy khám phá và lưu những công việc bạn yêu thích! ✨</p>
      </div>
    );
  }
  
  // Tạo danh sách job đã được gắn kèm companyData cho JobList
  const jobsWithCompany = savedJobs.map(job => ({
    ...job,
    company: companyData[job.companyId] || {}
  }));

  return (
    <div className='saved-job-page'>
      <h1>Saved Jobs</h1>
      
      {/* Sử dụng component JobList */}
      <JobList 
        jobs={jobsWithCompany} 
        // Truyền hàm xử lý click để mở modal lên (nếu JobList có hỗ trợ)
        // Hoặc truyền props để JobList xử lý việc click
        onJobClick={handleJobClick} 
        companyData={companyData} // Truyền companyData để tránh JobList fetch lại
        setSelectedJob={setSelectedJob} // Quan trọng: Truyền setter của selectedJob
      />

      {/* Hiển thị JobDetailModal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob.job}
          company={selectedJob.company}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default SavedJobPage;