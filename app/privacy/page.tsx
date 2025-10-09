import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Header />
            <div className="container-fluid py-5">
                <div className="text-center container px-4 sm:px-0 mt-24">
                    <h1 className="text-green-500 text-4xl font-monst-text mt-5">
                        Privacy Policy
                    </h1>
                </div>
            </div>
            <div className="container-fluid bg-dark-bg5">
                <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <p className="xsmall grey-color-2">
                        Peershieldex is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information when you use our website and services.
                    </p>

                    <h5 className="meri-weda mt-4">Information We Collect</h5>
                    <p className="xsmall grey-color-2">
                        We may collect personal information from you, such as your name, email address, and cryptocurrency wallet address, when you register for an account or use our services. We may also collect non-personal information, such as your IP address and browsing history, through the use of cookies and other tracking technologies.
                    </p>

                    <h5 className="meri-weda mt-4">How We Use Your Information</h5>
                    <p className="xsmall grey-color-2">
                        We may use your personal information to provide and improve our services, to communicate with you about your account and our services, and to comply with legal obligations. We may also use non-personal information for analytical purposes and to personalize your experience on our website.
                    </p>

                    <h5 className="meri-weda mt-4">Disclosure of Your Information</h5>
                    <p className="xsmall grey-color-2">
                        We may disclose your personal information to third-party service providers who assist us in providing our services, or to law enforcement or other government officials in response to a valid subpoena, court order, or other legal process. We will not sell or rent your personal information to third parties for their marketing purposes without your explicit consent.
                    </p>

                    <h5 className="meri-weda mt-4">Security of Your Information</h5>
                    <p className="xsmall grey-color-2">
                        We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee the absolute security of your information.
                    </p>

                    <h5 className="meri-weda mt-4">Changes to This Privacy Policy</h5>
                    <p className="xsmall grey-color-2">
                        We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website. You are advised to review this Privacy Policy periodically for any changes.
                    </p>

                    <h5 className="meri-weda mt-4">Contact Us</h5>
                    <p className="xsmall grey-color-2">
                        If you have any questions about this Privacy Policy, please contact us at support@peershieldex.com.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
