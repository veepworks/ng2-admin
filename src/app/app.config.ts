import {Injectable, Inject} from "@angular/core";

export interface AwsCognitoConfig {
    identityPoolId?: string;
    userPoolId?: string;
    clientId?: string;
}

export interface AwsConfig {
    region: string;
    cognitoConfig: AwsCognitoConfig;
}

@Injectable()
export class AppConfig {

    awsConfig: AwsConfig = {
        region: 'us-east-1',
        cognitoConfig: {
            identityPoolId: 'us-east-1:abe99555-0e55-4888-8649-28754bbf45ca',
            userPoolId: 'us-east-1_iVZf2cqss',
            clientId: '214t183rns053v5naap27gldu2'
        }
    };

    constructor() {
        
    }

    getAwsConfig(): AwsConfig {
        return this.awsConfig;
    }

}