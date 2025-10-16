import React, { useState } from 'react';
// Đã sửa đường dẫn, giả sử firebase nằm ở cấp độ src/
import { db, auth } from '../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
// Đã sửa đường dẫn CSS (giữ nguyên nếu nó cùng cấp với component)
import './applyForm.css'; 

const ApplicationModal = ({ job, company, onClose, onApplied }) => {
  const [personalInfo, setPersonalInfo] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Lấy userId hiện tại
  const currentUserId = auth.currentUser?.uid;
  const applicantName = auth.currentUser?.displayName || 'Candidate'; // Tên mặc định

  if (!currentUserId) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <h2>Apply to {job.title} at {company.name}</h2>
          <p className="error-message">Vui lòng đăng nhập để nộp đơn.</p>
          <button onClick={onClose} className="btn-close">Close</button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // Giới hạn 2MB
        setMessage('File CV quá lớn (Tối đa 2MB).');
        setCvFile(null);
    } else {
        setCvFile(file);
        setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setMessage('Vui lòng đính kèm CV.');
      return;
    }

    setLoading(true);
    setMessage('Đang gửi hồ sơ...');

    try {
      // 1. Giả lập upload CV (Trong thực tế cần dùng Firebase Storage)
      // Hiện tại, chúng ta chỉ lưu metadata và đường dẫn giả lập.
      const cvFileName = cvFile.name;
      // Lưu ý: cvFilePath chỉ là giá trị giả lập, cần thay thế bằng URL Storage thực tế sau khi upload
      const cvFilePath = `gs://your-storage-bucket/applications/${currentUserId}/${job.id}_${cvFileName}`;

      // 2. Tạo đối tượng hồ sơ ứng tuyển
      const applicationData = {
        candidateId: currentUserId,
        candidateName: applicantName,
        jobId: job.id,
        jobTitle: job.title,
        companyId: job.companyId,
        applicationDate: new Date(),
        status: 'Pending', // Trạng thái ban đầu
        personalInfo: personalInfo,
        coverLetter: coverLetter,
        cvFileName: cvFileName,
        cvFilePath: cvFilePath, 
      };

      // 3. Lưu hồ sơ vào Firestore
      // Path: applications/{jobId}__{candidateId}
      const applicationRef = doc(db, 'applications', `${job.id}__${currentUserId}`);
      await setDoc(applicationRef, applicationData);

      setMessage('Nộp đơn thành công!');
      onApplied(); // Cập nhật trạng thái nút Apply
      setTimeout(onClose, 1500);

    } catch (err) {
      console.error("Error submitting application:", err);
      setMessage('Lỗi: Không thể nộp đơn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Apply to {job.title}</h2>
        <p className="company-name-label">at {company.name}</p>

        <form onSubmit={handleSubmit} className="application-form">
          
          <div className="form-group">
            <label htmlFor="personalInfo">Thông tin cá nhân (Email/Phone):</label>
            <input
              id="personalInfo"
              type="text"
              value={personalInfo}
              onChange={(e) => setPersonalInfo(e.target.value)}
              placeholder="Email, Số điện thoại..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter (Tùy chọn):</label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="4"
              placeholder="Viết lời giới thiệu ngắn gọn về bản thân và lý do bạn ứng tuyển."
            ></textarea>
          </div>

          <div className="form-group file-upload-group">
            <label htmlFor="cvFile">Tải lên CV (PDF, DOCX):</label>
            <input
              id="cvFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
             {cvFile && <p className="file-name">File đã chọn: <strong>{cvFile.name}</strong></p>}
          </div>

          {message && <p className={`form-message ${message.includes('Lỗi') ? 'error-message' : 'success-message'}`}>{message}</p>}

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Đang gửi...' : 'Nộp Đơn Ứng Tuyển'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
