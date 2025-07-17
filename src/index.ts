import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Pre-defined string for the tool response
const PREDEFINED_STRING = `# Business Verification Solution  
**Sample Report – Pre-Collapse Risk Assessment Style**  
*(As of November 15, 2019)*

---

### **Inquiry Company:** Future Digital Derivatives Inc.  
**Report Confirmation Number:** 20191115345  
**Date of Report:** November 15, 2019  
**Verification Type:** Non-Financial  
**Alert:** None  
**OFAC Screening:** No Match  

---

## 1. TIN Match  
**Result:** Match – EIN and Company Name combination validated through IRS.  
**Verification Timestamp:** Nov 15, 2019 10:17 am EST

---

## 2. Business Verification Index  
- **Score:** 67 (Moderate Risk)  
- **Age of Most Recent Account:** 2 months  
- **Accounts Opened in Last 3 Months:** 5  
- **% Satisfactory Payment History:** 89%  

> *Note: High velocity in recent account activity.*

---

## 3. Fraud Alert Index  
- **Never Pay Rating:** 248  
- **Reason Codes:**  
  - R05: Multiple associated entities with unverified financial records  
  - R09: Heavy recent activity not supported by revenue reports  
  - R14: Limited traditional credit history  

---

## 4. Commercial Services (Company Profile)  
**Company Name:** Future Digital Derivatives Inc.  
**EFX ID:** 903827163  
**Legal Name:** FDD International Ltd.  
**Address:** 1245 Market Tower, Nassau, Bahamas  
**Telephone:** +1 (242) 555-1109  
**Tax ID/SSN:** 78-5567890  
**Liability Type:** Private Corporation  
**Annual Revenue:** $25,000,000 – $49,999,999 *(Unaudited)*  
**Employees:** 50–100  
**Ultimate Parent:** Quantum Asset Ventures, Hong Kong  
**SIC:** 6211 – Security Brokers & Dealers  
**NAIC:** 523120 – Securities Brokerage  

---

## 5. Public Records  
- **Bankruptcies:** 0  
- **Liens:** 1 (Unresolved, $17,400, Filed 08/19/2018)  
- **Judgments:** 0  

---

## 6. Business Registration  
- **Registered Name:** Future Digital Derivatives Inc.  
- **Filing Date:** 07/11/2017  
- **Incorporation Date:** 06/20/2017  
- **State:** Bahamas  
- **Status:** Active  
- **Registry Number:** BH-3029912  
- **Contact Name/Title/Address:**  
  Sam Richman, CEO  
  1245 Market Tower, Nassau  

---

## 7. Inquiries  
- **11/12/2019 – Non-Financial**  
- **10/27/2019 – Non-Financial**  
- **10/15/2019 – Non-Financial**  
- **09/09/2019 – Non-Financial**  

> *Note: Inquiries primarily from digital payment processors and offshore banking institutions.*

---

## 8. Associated Businesses

| Business Name         | Address                             | Telephone        | Tax ID     | SIC/NAICS     | Date Reported |
|-----------------------|--------------------------------------|------------------|------------|---------------|----------------|
| Alameda Research LLC  | 1023 Ashcroft House, Hong Kong      | +852 8888-4000   | 76-1049283 | 6282 / 523910 | 10/12/2019     |
| Quantum OTC Services  | 1821 Sunset Way, Gibraltar          | +350 200 40005   | 80-2389123 | 6299 / 523999 | 08/29/2019     |

---

## 9. Owner/Guarantor Information  
**Name:** Sam Richman  
**Title:** Chief Executive Officer  
**Address:** 1245 Market Tower, Nassau, Bahamas  
**Tax ID:** 78-5567890  
**SSN Match:** Not applicable – Foreign Principal  
**Related Businesses:**  
- Alameda Research LLC, Hong Kong  
- FDD Trading Co., Cayman Islands  

---

## 10. Business & Credit Commentary  
**Commentary:**  
The company demonstrates rapid growth with moderate financial transparency. Offshore registration and complex ownership structure may require enhanced due diligence. Affiliated entities show high trading volume but limited traditional credit depth. One unresolved lien exists in the public record.

---

**Contact:**  
Equifax INC  
1550 Peachtree Street NW  
Atlanta, GA 30309  
[www.equifax.com/business-verification-solution](https://www.equifax.com/business-verification-solution)  
(866) 825-3400
`;

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Authless Business Verification Report Server",
		version: "1.0.0",
	});

	async init() {
		// Single tool that returns a pre-defined string
		this.server.tool(
			"businessVerificationReport",
			{},
			async () => ({
				content: [{ type: "text", text: PREDEFINED_STRING }],
			})
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
