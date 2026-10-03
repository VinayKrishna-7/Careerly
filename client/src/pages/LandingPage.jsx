import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button.jsx';
import { ArrowRight, UserPlus, LogIn } from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-black dark:text-[#faf5eb] tracking-tight leading-tight">
          Create clean, job-ready resumes in minutes.
        </h1>

        <p className="text-base sm:text-lg text-[#5c5549] dark:text-[#a39b8e] max-w-2xl mx-auto leading-relaxed">
          Careerly is a simple, free resume and cover letter builder. Fill in your experience, choose your layout, and download a clean PDF designed to pass applicant tracking systems.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" className="px-8 py-3.5 text-base font-bold gap-2">
                <span>Go to My Resumes</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" className="px-8 py-3.5 text-base font-bold gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Build Your Resume — Free</span>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="px-7 py-3.5 text-base font-semibold gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            </>
          )}
        </div>

        <p className="text-xs text-[#756d61] dark:text-[#a39b8e] pt-6 font-medium">
          Free forever &nbsp;•&nbsp; No credit card required &nbsp;•&nbsp; ATS-optimized vector PDF
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
