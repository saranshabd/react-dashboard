import React from 'react';

function Contributors() {
  return (
    <div className="contributors" style={{marginTop: '20px'}}>
      <a href="http://thinkief.org/">
        <img
          className="contributorItem"
          //   src={require('../ief.png').default}
          src={require('../newLogo.png').default}
          alt=""
        />
      </a>
    </div>
  );
}

export default Contributors;
