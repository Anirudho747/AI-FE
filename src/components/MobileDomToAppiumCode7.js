import React, { useState } from "react";

const GeneratePOM = () => {
    const [xmlInput, setXmlInput] = useState("");
    const [platform, setPlatform] = useState("DYNAMIC_RUNTIME");
    const [className, setClassName] = useState("TestPage");
    const [packageName, setPackageName] = useState("com.mobile.pages");
    const [baseClassName, setBaseClassName] = useState("MobileBase");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const generatePOMAndDownload = async () => {
        if (!xmlInput.trim()) {
            setErrorMessage("Please paste your Appium XML content.");
            return;
        }
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:8080/api/pom/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    xmlContent: xmlInput,
                    platform,
                    className,
                    packageName,
                    baseClassName,
                }),
            });

            if (!response.ok) throw new Error("Failed to generate mobile POM");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${className}.java`;
            link.click();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginBottom: '1000px' }}>
            <h2>Generate Mobile POM Class</h2>

            {errorMessage && <div style={{ marginBottom: '20px' }} className="error">{errorMessage}</div>}

            <div style={{ marginBottom: '20px' }}>
            <label style={{ padding: '50px'}}>Locator Strategy:</label>
            <select style={{ width: '250px', height: '40px' }} value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="ANDROID">Android Only</option>
                <option value="IOS">iOS Only</option>
                <option value="CROSS_PLATFORM">Cross-platform (Static)</option>
                <option value="DYNAMIC_RUNTIME">Cross-Platform (Dynamic)</option>
            </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
            <label style={{ padding: '65px'}}>Class Name:</label>
            <input
                type="text"
                value={className}
                style={{ width: '230px', height: '20px' }}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="LoginPage"
            />
            </div>

            <div style={{ marginBottom: '20px' }}>
            <label style={{ padding: '54px'}}>Package Name:</label>
            <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                style={{ width: '230px', height: '20px' }}
                placeholder="com.mobile.pages"
            />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <>
                    <label style={{ padding: '9px'}}>Base Class Name (optional):</label>
                    <input
                        type="text"
                        value={baseClassName}
                        onChange={(e) => setBaseClassName(e.target.value)}
                        style={{ width: '230px', height: '20px' }}
                        placeholder="MobileBase"
                    />
                </>
            </div>

            <div style={{display: 'flex', alignItems: 'center',marginBottom: '40px'}}>
                <label style={{ padding: '8px'}}>Paste Appium XML Content:</label>
                <textarea
                    value={xmlInput}
                    onChange={(e) => setXmlInput(e.target.value)}
                    placeholder="Paste Appium Inspector XML here..."
                    rows={15}
                    style={{width: '415px', height: '200px'}}
                />
            </div>

            <div >
                <button style={{ width: '650px', height: '40px' }} onClick={generatePOMAndDownload} disabled={loading}>
                {loading ? "Generating..." : "Generate & Download POM"}
            </button>
            </div>
        </div>
    );
};

export default GeneratePOM;

