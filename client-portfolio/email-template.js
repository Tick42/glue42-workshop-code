const emailTemplateString = ` <html xml:lang="en" lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Untitled Document</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
  </head>
  <body style="background-color: #272b35; color: #f7f7f7; font-family: Arial; font-family:Arial,sans-serif;">
    <table border="0" cellpadding="10" cellspacing="0" style="background-color: #272b35; color: #f7f7f7; font-family: Arial; font-family:Arial,sans-serif; line-height:16px; border-collapse:collapse;" width="100%">
      <tbody>
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse" width="640">
              <tbody>
                <tr>
                  <td colspan="3" height="57">
                    <table align="center" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-bottom: 1px solid #9e9e9e;" width="100%">
                      <tbody>
                        <tr>
                          <td width="24">&nbsp;</td>
                          <td height="75" valign="middle">
                            <h2 style="font-weight: lighter;"><span id="displayName"></span> – <small>Portfolio</small></h2></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" height="15" width="100%">&nbsp;</td>
                </tr>
                <tr>
                  <td width="15">&nbsp;</td>
                  <td>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="border-row" width="100%" id="portfolio-table">
                      <thead>
                        <tr>
                          <th style="border-bottom: 1px solid #5b7a7d; color: #779699;" width="15">&nbsp;</th>
                          <th align="left" height="28" style="border-bottom: 1px solid #5b7a7d; color: #779699;" width="55">RIC</th>
                          <th style="border-bottom: 1px solid #5b7a7d; color: #779699;" width="15">&nbsp;</th>
                          <th align="left" style="border-bottom: 1px solid #5b7a7d; color: #779699;" width="175">Name</th>
                          <th style="border-bottom: 1px solid #5b7a7d; color: #779699;" width="15">&nbsp;</th>
                          <th align="right" style="border-bottom: 1px solid #5b7a7d; color: #779699;" width="175">Price</th>
                          <th style="border-bottom: 1px solid #5b7a7d; color: #779699;" width="15">&nbsp;</th>
                          <th align="right" style="border-bottom: 1px solid #5b7a7d; color: #779699; padding-right: 8px;" width="85">No. of Shares</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="empty-row" style="display: none">
                          <td style="border-bottom: 1px solid #5b7a7d;" width="15">&nbsp;</td>
                          <td align="left" height="28" style="border-bottom: 1px solid #5b7a7d; line-height: 1.5;" width="55" id="ric"></td>
                          <td style="border-bottom: 1px solid #5b7a7d;" width="15">&nbsp;</td>
                          <td align="left" height="28" style="border-bottom: 1px solid #5b7a7d; line-height: 1.5;" width="175" id="description"></td>
                          <td style="border-bottom: 1px solid #5b7a7d;" width="15">&nbsp;</td>
                          <td align="right" height="28" style="border-bottom: 1px solid #5b7a7d; line-height: 1.5;" width="175" id="price"></td>
                          <td style="border-bottom: 1px solid #5b7a7d;" width="15">&nbsp;</td>
                          <td align="right" height="28" style="border-bottom: 1px solid #5b7a7d; padding-right: 8px; line-height: 1.5;" width="85" id="shares"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td width="15">&nbsp;</td>
                </tr>
                <tr>
                  <td colspan="3" height="30" width="100%">&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-top: 1px solid #9e9e9e;" width="640">
          <tbody>
            <tr>
              <td width="20">&nbsp;</td>
              <td height="57">
                <a alt="Glue42" href="http://glue42.com/"
                  style="cursor:pointer;" target="_blank"><img alt="Glue42 for enterprise"
                  height="40" src="data:image/png;base64,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"
                  style="outline:none; display:block; text-decoration:none;"></a>
              </td>
            </tr>
          </tbody>
        </table>
      </tfoot>
    </table></body></html>`;

let emailTemplate = document.createElement('html');
emailTemplate.innerHTML = emailTemplateString; export { emailTemplate };