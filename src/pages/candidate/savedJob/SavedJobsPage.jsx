import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './savedJobs.css';
// ⚠️ Giả sử đường dẫn này là đúng đến component JobList và JobDetailModal của bạn
import JobList from '../jobList/JobList';
import JobDetailModal from '../jobList/JobDetailModal';

function SavedJobPage() {
    // --- STATE & HOOKS (GIỮ NGUYÊN) ---
    const [currentUser, setCurrentUser] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);
    const [companyData, setCompanyData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

    // Bước 1: Xác định người dùng hiện tại (Logic giữ nguyên)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user !== undefined) setLoading(false);
            if (!user) {
                setError('Vui lòng đăng nhập để xem công việc đã lưu của bạn.');
            } else {
                setError(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Bước 2 & 3: Truy vấn danh sách Job đã lưu và lấy thông tin chi tiết từng Job (Logic giữ nguyên)
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

    // Lấy thông tin công ty cho các job đã lưu (Logic giữ nguyên)
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


    // --- HANDLERS (GIỮ NGUYÊN) ---

    const handleJobClick = (job) => {
        const company = companyData[job.companyId] || {};
        setSelectedJob({ job, company });
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    // --- RENDER FUNCTIONS (BỐ CỤC MỚI) ---

    const renderLoadingState = () => (
        <div className='status-container'>
            <div className="loading-spinner"></div>
            <p className="status-message">Đang tải công việc đã lưu... ⏳</p>
        </div>
    );

    const renderErrorState = (message) => (
        <div className='status-container'>
            <p className="error-message">❌ {message}</p>
        </div>
    );
    
    const renderEmptyState = () => (
        <div className='status-container empty-state'>
            <span className="empty-icon"></span>
            <p className="status-message">Bạn chưa lưu công việc nào.</p>
            <p className="suggestion-message">Hãy khám phá và lưu những công việc bạn yêu thích! ✨</p>
            {/* Thêm nút hoặc link chuyển hướng đến trang tìm kiếm nếu cần */}
            {/* <button className="primary-btn">Khám phá ngay</button> */}
        </div>
    );
    
    // --- MAIN RENDER LOGIC ---

    if (loading) {
        return (
            <div className='saved-job-page'>
                <h1>Công việc đã lưu của tôi</h1>
                {renderLoadingState()}
            </div>
        );
    }

    if (error) {
        return (
            <div className='saved-job-page'>
                <h1>Công việc đã lưu của tôi</h1>
                {renderErrorState(error)}
            </div>
        );
    }
    
    // Nếu không đăng nhập (currentUser là null sau khi loading xong)
    if (!currentUser) {
         // Hiển thị thông báo đăng nhập ngay trong phần error render
        return (
            <div className='saved-job-page'>
                <h1>Saved Jobs</h1>
                {renderErrorState('Vui lòng đăng nhập để xem công việc đã lưu của bạn. 🔒')}
            </div>
        );
    }

    if (savedJobs.length === 0) {
        return (
            <div className='saved-job-page'>
                <h1>Saved jobs</h1>
                {renderEmptyState()}
            </div>
        );
    }

    // Tạo danh sách job đã được gắn kèm companyData cho JobList (Logic giữ nguyên)
    const jobsWithCompany = savedJobs.map(job => ({
        ...job,
        company: companyData[job.companyId] || {}
    }));

    // Bố cục chính
    return (
        <div className='saved-job-page'>
            <h1>Saved Jobs</h1>

            {/* Container cho danh sách công việc */}
            <div className="job-list-container">
                <JobList
                    jobs={jobsWithCompany}
                    onJobClick={handleJobClick}
                    companyData={companyData}
                    setSelectedJob={setSelectedJob}
                />
            </div>

            {/* Modal Chi tiết Công việc */}
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